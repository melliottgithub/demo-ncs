import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import RestService from "../services";
import Button from "../widgets/button";
import Flex from "../widgets/flex";
import ShiftCard from "./ShiftCard";
import ShiftOverlapCard from "./ShiftOverlap";

export default function Shifts() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Record<string, any>[]>();
  const [shiftsOverlap, setShiftsOverlap] = useState<string[]>([]);

  const onShiftSelection = (item: Record<string, any>) => {
    const exists = shiftsOverlap.includes(item.shift_id);
    if (!exists) {
      const newState = [...shiftsOverlap];
      newState.unshift(item.shift_id);
      setShiftsOverlap(newState.slice(0, 2));
    } else {
      const newState = shiftsOverlap.filter((id) => id !== item.shift_id);
      setShiftsOverlap(newState);
    }
  };

  const openQuery = (name: string) => {
    navigate(`/query/${name}`);
  };

  useEffect(() => {
    RestService.getShifts().then((shifts) => {
      setShifts(shifts);
    });
  }, []);
  return (
    <Flex flexDirection={"column"} rowGap="32px">
      <Flex flexDirection={"column"} rowGap="16px">
        <ShiftOverlapCard
          shifts={shiftsOverlap}
        />
        <Flex flexDirection={"row"} rowGap="16px" wrap>
          {shifts?.map((s) => (
            <ShiftCard
              key={s.shift_id}
              shift={s}
              selected={shiftsOverlap.includes(s.shift_id)}
              onItemClick={onShiftSelection}
            />
          ))}
        </Flex>
      </Flex>
      <Flex flexDirection={"row"} rowGap="16px" wrap>
        <Button
          onClick={() => openQuery("remaining-spots")}
          variant={"secondary"}
        >
          Execute Q4 Query
        </Button>
        <Button
          onClick={() => openQuery("matching-jobs")}
          variant={"secondary"}
        >
          Execute Q5 Query
        </Button>
        <Button onClick={() => openQuery("coworkers")} variant={"secondary"}>
          Execute Q6 Query
        </Button>
      </Flex>
    </Flex>
  );
}
