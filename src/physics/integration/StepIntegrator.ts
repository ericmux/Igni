import Body from "../bodies/Body";

interface StepIntegrator {
    integrate: (body :Body, dt :number) => void;
}
export default StepIntegrator;