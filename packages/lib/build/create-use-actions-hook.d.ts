/// <reference types="react" />
import { RxStore } from "./rx-store";
import { ActionFactorySelectorFunction, ActionFactory } from "./connect-actions";
export declare function createUseActionsHook<STATE extends object, SUB_STATE extends object, ACTIONS>(provider: React.Context<RxStore<STATE>>, selectorFunction: ActionFactorySelectorFunction<STATE, SUB_STATE>, actionFactory: ActionFactory<STATE, SUB_STATE, ACTIONS>): () => ACTIONS;
//# sourceMappingURL=create-use-actions-hook.d.ts.map