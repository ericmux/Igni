import Body from "../bodies/Body";

interface StepIntegrator {
    integrate: (body :Body, time: number, dt :number) => void;
}
export default StepIntegrator;