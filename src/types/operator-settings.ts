export interface RechargeSetting {
    id?: string;
    code: string;
    mobile: string;
    value: string;
    pinCode: string;
    device: string;
    simSlot: string;
}

export interface BalanceCheckSetting {
    id?: string;
    mobileNumber: string;
    code: string;
    device: string;
    simSlot: string;
}

export interface UssdHistoryItem {
  id: number;
  code: string;
  response: string;
  status: string;
  created: number; // Unix timestamp
  device: string;
  sim: number;
  mobileNumber?: string;
}
