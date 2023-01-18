import Card from "../widgets/card";
import Flex from "../widgets/flex";

type ShiftCardProps = {
  shift: Record<string, any>;
  selected: boolean;
  onItemClick: (item: Record<string, any>) => void;
};

function dateFormat(date: Date) {
  return date ? date.toISOString().substring(0, 10) : "";
}

function timeFormat(time: string) {
  if (typeof time != "string") {
    return "";
  }
  let [hr, min] = time.split(":");
  const ampm = Number.parseInt(hr) > 12 ? "PM" : "AM";
  if (ampm === "PM") {
    hr = (Number.parseInt(hr) - 12).toString().padStart(2, "0");
  }
  return `${hr}:${min} ${ampm}`;
}

export default function ShiftCard({
  shift,
  selected,
  onItemClick
}: ShiftCardProps) {
  const cursorPointer =
    typeof onItemClick == "function" ? { cursor: "pointer" } : {};
  return (
    <Card
      title={shift.facility_name}
      onClick={() => onItemClick(shift)}
      className={selected ? "bg-primary" : "white"}
      style={cursorPointer}
    >
      <Flex flexDirection="column" rowGap="2px">
        <div className="center">{dateFormat(shift.shift_date)}</div>
        <div className="center">
          {timeFormat(shift.start_time)} - {timeFormat(shift.end_time)}
        </div>
      </Flex>
    </Card>
  );
}
