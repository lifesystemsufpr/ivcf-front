import { Input } from "@/core/components/ui";

interface DateFilterProps {
  onChange: (date: string) => void;
  value: string;
  id?: string;
}

export default function DateFilter({ onChange, value, id }: DateFilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return <Input id={id} type="date" value={value} onChange={handleChange} />;
}
