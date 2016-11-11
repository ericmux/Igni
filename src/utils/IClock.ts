export interface IClock {

    physicsUpdatePeriod : number;
    lastPhysicsTick : number;
    deltaTime : number;
    lastFrameTime : number;
    frameCount : number;
    pausedTime : number;
    pausedAt : number;
    framePhysicsSteps : number;
}