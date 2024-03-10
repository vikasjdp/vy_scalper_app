import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

const SubmitButton = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button className={className} aria-disabled={pending}>
      {pending ? "Working..." : text}
    </Button>
  );
};

export default SubmitButton;
