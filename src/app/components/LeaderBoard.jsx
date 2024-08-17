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
import supabase from "../config/Database";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LeaderBoard() {
  const [dataList, setDataList] = useState([]);

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

  const handleBlur = async (e, entry) => {
    // Retrieve value from input field
    const value = e.target.value;

    // Validate if the value is a number or decimal
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      await updateData(entry.id, parsedValue);
    } else {
      // Handle invalid input if necessary
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
      getList();
    }
  };

  return (
    <Table>
      <TableCaption>Last updated: 17 Aug 2024</TableCaption>
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
                <Input
                  type="number"
                  step="any"
                  placeholder="example: 50"
                  defaultValue={entry.change}
                  onBlur={(e) => handleBlur(e, entry)} // Use a function reference
                />
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
