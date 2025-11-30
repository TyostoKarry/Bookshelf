"use client";

import { CalendarIcon } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

function formatAsLocalIso(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
}

interface CalendarInputProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  error?: boolean;
}

export const DatePicker: FC<CalendarInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const date = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(
            "flex flex-1 w-full items-center justify-end rounded-md border border-input bg-card px-3 py-2 text-sm text-right text-foreground shadow-sm transition-colors",
            "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            error
              ? "border-destructive focus-visible:ring-destructive/20"
              : "focus-visible:ring-ring",
          )}
        >
          <div className="flex items-center gap-2 text-left">
            <span>
              {date ? (
                date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              ) : (
                <span className="text-muted-foreground">
                  {t("common.pickDate")}
                </span>
              )}
            </span>
          </div>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(picked) => {
            if (!picked) return;
            onChange?.(formatAsLocalIso(picked));
            setOpen(false);
          }}
          className="pb-0"
        />
        <Button
          variant="link"
          onClick={() => {
            onChange?.(null);
            setOpen(false);
          }}
          className="pt-0"
        >
          {t("common.clear")}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
