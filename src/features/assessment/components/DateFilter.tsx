import { Input } from "@/core/components/ui";

interface DateFilterProps {
  onChange: (date: string) => void;
  value: string;
}

export default function DateFilter({ onChange, value }: DateFilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return <Input type="date" value={value} onChange={handleChange} />;
}
