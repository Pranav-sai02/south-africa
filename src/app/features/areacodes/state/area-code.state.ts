import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { AreaCodes } from '../models/AreaCodes';
import { AreaCodesService } from '../services/areacodes/area-codes.service';
import { of } from 'rxjs';
import { AddAreaCode, LoadAreaCodes, SoftDeleteAreaCode, UpdateAreaCode } from './area-code.actions';


export interface AreaCodesStateModel {
  areaCodes: AreaCodes[];
}

@State<AreaCodesStateModel>({
  name: 'areaCodes',
  defaults: {
    areaCodes: [],
  },
})
@Injectable()
export class AreaCodesState {
  constructor(private areaCodesService: AreaCodesService) {}

  @Selector()
  static getAreaCodes(state: AreaCodesStateModel) {
    return state.areaCodes;
  }

  @Action(LoadAreaCodes)
  loadAreaCodes(ctx: StateContext<AreaCodesStateModel>) {
    return this.areaCodesService.getAreaCodes().pipe(
      tap((areaCodes) => {
        console.log('AreaCodes loaded from API:', areaCodes);
        ctx.patchState({ areaCodes });
      })
    );
  }

  // @Action(AddAreaCode)
  // addAreaCode(ctx: StateContext<AreaCodesStateModel>, action: AddAreaCode) {
  //   const state = ctx.getState();
  //   ctx.patchState({
  //     areaCodes: [...state.areaCodes, action.payload],
  //   });
  //   // Optionally, call backend API to persist the new area code
  //   return this.areaCodesService.addAreaCode(action.payload);
  // }


  @Action(AddAreaCode)
  addAreaCode(ctx: StateContext<AreaCodesStateModel>, action: AddAreaCode) {
    const state = ctx.getState();
    ctx.patchState({
      areaCodes: [action.payload, ...state.areaCodes],
    });
    return this.areaCodesService.addAreaCode(action.payload);
  }


  // @Action(UpdateAreaCode)
  // updateAreaCode(
  //   ctx: StateContext<AreaCodesStateModel>,
  //   action: UpdateAreaCode
  // ) {
  //   const state = ctx.getState();
  //   const updatedAreaCodes = state.areaCodes.map((areaCode) =>
  //      areaCode.AreaCode === action.payload.AreaCode
  //       ? action.payload
  //       : areaCode
  //   );
  //   ctx.patchState({ areaCodes: updatedAreaCodes });
  //   return this.areaCodesService.updateAreaCode(action.payload);
  // }

  @Action(UpdateAreaCode)
updateAreaCode(ctx: StateContext<AreaCodesStateModel>, action: UpdateAreaCode) {
  return this.areaCodesService.updateAreaCode(action.payload).pipe(
    tap(() => {
      const state = ctx.getState();
      const updatedAreaCodes = state.areaCodes.map((areaCode) =>
        areaCode.AreaCode === action.payload.AreaCode ? action.payload : areaCode
      );
      ctx.patchState({ areaCodes: updatedAreaCodes });
    }),
    catchError(error => {
      console.error('Update failed:', error);
      return of(error);
    })
  );
}

  @Action(SoftDeleteAreaCode)
  softDeleteAreaCode(
    ctx: StateContext<AreaCodesStateModel>,
    action: SoftDeleteAreaCode
  ) {
    const state = ctx.getState();
    const updatedAreaCodes = state.areaCodes.filter(
      (areaCode) => areaCode.AreaCodeId !== action.payload.AreaCodeId
    );
    ctx.patchState({ areaCodes: updatedAreaCodes });
    return this.areaCodesService.softDeleteAreaCode(action.payload);
  }
}
