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
      throw error;
    }

    setDataList(leaderBoard);
    console.log(leaderBoard);
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

    const newTotal = currentEntry.total + newValue;

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
    <Table className="">
      <TableCaption>Leader board</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead >Player&apos;s Name</TableHead>
          <TableHead>Current Session Change</TableHead>
          {/* <TableHead>Current Season</TableHead> */}
          {/* <TableHead>Previous Seasons</TableHead> */}
          <TableHead className="text-right">Total Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataList &&
          dataList.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="+50"
                  defaultValue={entry.change}
                  onBlur={(e) => updateData(entry.id, parseInt(e.target.value))} // Update data on blur event
                />
              </TableCell>
              {/* <TableCell>{entry.s2}</TableCell> */}
              {/* <TableCell>{entry.s1}</TableCell> */}
              <TableCell className="text-right">{entry.total}</TableCell>
            </TableRow>
          ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
