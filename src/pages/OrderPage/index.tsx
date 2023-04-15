import { ChangeEvent, FC, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Input } from "antd";

type OrderPageStates = "iinEnter" | "main";
export const OrderPage: FC = () => {
  const { id } = useParams();
  const [state, setState] = useState<OrderPageStates>("iinEnter");
  const [iin, setIin] = useState<string>("");
  const handleIinSubmit = () => {
    setState("main");
  };
  return state === "iinEnter" ? (
    <div>
      <div>
        <label>Request ID</label>
        <Input className="!tw-text-white" disabled value={id} />
      </div>
      <div>
        <label>IIN</label>
        <Input
          value={iin}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setIin(e.target.value);
          }}
        />
      </div>
      <Button
        disabled={iin.length !== 12}
        className="!tw-bg-white"
        onClick={handleIinSubmit}
      >
        Proceed
      </Button>
    </div>
  ) : (
    <div>nextStep</div>
  );
};
