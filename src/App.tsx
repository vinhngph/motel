import "./App.css";
import { StepBill } from "./components/StepBill";
import { StepDien } from "./components/StepDien";
import { StepNuoc } from "./components/StepNuoc";
import { StepRac } from "./components/StepRac";
import { StepThue } from "./components/StepThue";
import { useStore } from "./store";

function App() {
  const step = useStore((s) => s.step);
  return (
    <div className="max-w-md mx-auto">
      {" "}
      {step === "dien" && <StepDien />}
      {step === "nuoc" && <StepNuoc />}
      {step === "rac" && <StepRac />}
      {step === "thue" && <StepThue />}
      {step === "bill" && <StepBill />}
    </div>
  );
}

export default App;
