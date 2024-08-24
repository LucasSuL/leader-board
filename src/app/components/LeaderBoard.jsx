"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import supabase from "../config/Database";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function LeaderBoard() {
  const [dataList, setDataList] = useState([]);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    let { data: leaderBoard, error } = await supabase
      .from("leaderBoard")
      .select("*")
      .order("total", { ascending: false }); // Sort by total in descending order

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return;
    }

    setDataList(leaderBoard);
    console.log(leaderBoard);
  };

  const handleInputChange = (e, id) => {
    const value = e.target.value;
    // Allow empty string (for deletion) or a valid number
    if (value === "" || !isNaN(value)) {
      setInputValues((prevValues) => ({
        ...prevValues,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (id) => {
    const newValue = parseFloat(inputValues[id]);
    if (!isNaN(newValue)) {
      await updateData(id, newValue);
    } else {
      console.warn("Invalid input. Please enter a valid number.");
    }
  };

  const updateData = async (id, newValue) => {
    // Fetch the current data for the entry
    const { data: currentEntry, error: fetchError } = await supabase
      .from("leaderBoard")
      .select("total")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching current data:", fetchError);
      return;
    }

    const newTotal = (currentEntry.total || 0) + newValue;

    // Update the entry with the new values
    const { data, error } = await supabase
      .from("leaderBoard")
      .update({
        change: newValue,
        total: newTotal,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating data:", error);
    } else {
      console.log("Data updated:", data);
      // Optionally, refresh the data list after updating
      alert("Update successfully!");
      getList();
    }
  };

  return (
    <Table>
      <TableCaption>Last updated: 24 Aug 2024</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player&apos;s Name</TableHead>
          <TableHead>Current Session Change</TableHead>
          <TableHead className="text-right">Total Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataList &&
          dataList.map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                {index === 0 && `🥇 ${entry.name}`}
                {index === 1 && `🥈 ${entry.name}`}
                {index === 2 && `🥉 ${entry.name}`}
                {index > 2 && entry.name}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="any"
                    placeholder="example: 50"
                    value={
                      inputValues[entry.id] !== undefined
                        ? inputValues[entry.id]
                        : entry.change
                    }
                    onChange={(e) => handleInputChange(e, entry.id)}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Submit</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Your Session Change:
                          <span className="ms-1">{inputValues[entry.id]}</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          update your account from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleSubmit(entry.id)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {entry.change > 0 ? (
                  <div className="flex gap-2 items-center justify-end ">
                    <Image
                      src={"/icons8-arrow-48.png"}
                      width={15}
                      height={15}
                      alt="up"
                    ></Image>
                    {entry.total}
                  </div>
                ) : entry.change < 0 ? (
                  <div className="flex gap-2 items-center justify-end ">
                    <Image
                      src={"/icons8-arrow-d-48.png"}
                      width={15}
                      height={15}
                      alt="down"
                    ></Image>
                    {entry.total}
                  </div>
                ) : (
                  entry.total
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
