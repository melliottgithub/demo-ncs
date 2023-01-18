import { useState } from "react";
import RestService from "../services";
import Button from "../widgets/button";
import Card from "../widgets/card";
import Flex from "../widgets/flex";

const CardContentStyle = {
  alignItems: "center",
  marginRight: "24px",
  maxWidth: "30em",
};

function booleanToString(bool: boolean): string {
  if (typeof bool == "boolean") {
    return bool ? "True" : "False";
  }
  return "";
}

type ShiftCardProps = {
  shifts: string[];
};

export default function ShiftOverlapCard({ shifts }: ShiftCardProps) {
  const [lastResult, setLastResult] = useState<any>();

  const onSubmit = () => {
    if (shifts.length === 2) {
      RestService.getShiftsOverlap(shifts).then((result) => {
        setLastResult(result);
      });
    }
  };
  const isSameResult =
    shifts.includes(lastResult?.shift1_id) &&
    shifts.includes(lastResult?.shift2_id);
  const result = isSameResult ? lastResult : {};
  return (
    <Card key={"overlap"}>
      <Flex flexDirection="row" rowGap="72px" style={CardContentStyle}>
        <Flex flexDirection="column" rowGap="4px" style={{ minWidth: "18em" }}>
          <div>Overlap Minutes: {result?.overlap_minutes}</div>
          <div>Max Overlap Threshold: {result?.max_overlap_minutes}</div>
          <div>
            Exceeds Overlap Threshold:{" "}
            {booleanToString(result?.exceeds_overlap_threshold)}
          </div>
        </Flex>
        <div>
          <Button
            onClick={onSubmit}
            variant={"primary"}
            disabled={shifts?.length !== 2}
          >
            Submit
          </Button>
        </div>
      </Flex>
    </Card>
  );
}
