import { ListenerService } from "./listener.service";

export interface ITabGroup extends chrome.tabGroups.TabGroup {
  tabs: chrome.tabs.Tab[]
}

export class TabGroupManager {
  getTabs(groupId: number): Promise<any> {
    return chrome.tabs.query({ groupId });
  }

  getInCurrentWindow(): Promise<ITabGroup[]> {
    return new Promise((resolve, reject) => {
      this.query({
        windowId: chrome.windows.WINDOW_ID_CURRENT
      }).then((groups: chrome.tabGroups.TabGroup[]) => {
        const actions = groups.map(group => this.getTabs(group.id));
        Promise.all(actions)
          .then((results: chrome.tabs.Tab[][]) => {
            if (results.length !== groups.length) {
              console.warn("TabGroupManager.getInCurrentWindow: number of tab queries does not match number of groups", {groups, results, actions});
              reject("Oops - TabGroupManager.getInCurrentWindow: number of tab queries does not match number of groups");
            } else {
              resolve(groups.map((group: chrome.tabGroups.TabGroup, index: number) => {
                return {
                  ...group,
                  tabs: results[index]
                } as ITabGroup;
              }));  
            }
          })
      })
    });
  }

  //alias
  query(queryInfo: any): Promise<chrome.tabGroups.TabGroup[]> {
    return chrome.tabGroups.query(queryInfo);
  }

  //#region *** LISTENERS ***

  private _onUpdate: ListenerService<chrome.tabGroups.TabGroup> | null = null;
  get onUpdate() {
    if (!this._onUpdate) {
      this._onUpdate = new ListenerService<chrome.tabGroups.TabGroup>("chrome.tabGroups.onUpdated", chrome.tabGroups.onUpdated);
    }
    return this._onUpdate;
  }

  private _onCreated: ListenerService<chrome.tabGroups.TabGroup> | null = null;
  get onCreated() {
    if (!this._onCreated) {
      this._onCreated = new ListenerService<chrome.tabGroups.TabGroup>("chrome.tabGroups.onCreated", chrome.tabGroups.onCreated);
    }
    return this._onCreated;
  }

  //#endregion ... LISTENERS ...

}

