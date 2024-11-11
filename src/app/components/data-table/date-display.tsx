import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  formatDistanceToNowStrict,
} from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";

interface TimeDiff {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function formatUnit(value: number, singular: string, plural: string) {
  if (value === 0 && plural === "seconds") return <span>00 seconds</span>;
  if (value === 0) return null;
  return <span>{`${value} ${value === 1 ? singular : plural}`}</span>;
}

export default function DateDisplay({
  date,
  type,
}: {
  date: Date;
  type: string;
}) {
  const [open, setOpen] = useState(false);
  const [timeDiff, setTimeDiff] = useState<TimeDiff>({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const targetDate = new Date(date);

      const diff = {
        years: differenceInYears(now, targetDate),
        months: differenceInMonths(now, targetDate),
        weeks: differenceInWeeks(now, targetDate),
        days: differenceInDays(now, targetDate),
        hours: differenceInHours(now, targetDate),
        minutes: differenceInMinutes(now, targetDate),
        seconds: differenceInSeconds(now, targetDate),
      };

      if (type === "countdown") {
        for (const key in diff) {
          diff[key as keyof TimeDiff] = Math.abs(diff[key as keyof TimeDiff]);
        }
      }

      setTimeDiff(diff);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [date, type]);

  return (
    <div className="flex items-center">
      about {formatDistanceToNowStrict(date)}{" "}
      {type === "countdown" ? "left" : "passed"}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <Info className="ml-2 h-4 w-4" />
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex flex-col items-center mx-auto w-full max-w-sm">
            <DrawerHeader className="justify-items-center">
              <DrawerTitle className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl">
                {type === "countdown" ? "Countdown" : "Count Up"}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground font-semibold">
                {type === "countdown" ? "Time left" : "Time passed"}
              </DrawerDescription>
            </DrawerHeader>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
              Compacted
            </h3>
            <div className="text-center flex items-center gap-2 py-4">
              {formatUnit(timeDiff.years, "year", "years")}
              {formatUnit(timeDiff.months % 12, "month", "months")}
              {formatUnit(timeDiff.weeks, "week", "weeks")}
              {formatUnit(timeDiff.days % 7, "day", "days")}
              {formatUnit(timeDiff.hours % 24, "hour", "hours")}
              {formatUnit(timeDiff.minutes % 60, "minute", "minutes")}
              {formatUnit(timeDiff.seconds % 60, "second", "seconds")}
            </div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
              Expanded
            </h3>
            <div className="flex flex-col items-center">
              {formatUnit(timeDiff.years, "year", "years")}
              {formatUnit(timeDiff.months, "month", "months")}
              {formatUnit(timeDiff.weeks, "week", "weeks")}
              {formatUnit(timeDiff.days, "day", "days")}
              {formatUnit(timeDiff.hours, "hour", "hours")}
              {formatUnit(timeDiff.minutes, "minute", "minutes")}
              {formatUnit(timeDiff.seconds, "second", "seconds")}
            </div>
          </div>
          <DrawerFooter className="mx-auto">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
