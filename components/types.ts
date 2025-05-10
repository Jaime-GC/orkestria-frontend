export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  status?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role?: string;
}

export interface ResourceGroup {
  id: string;
  name: string;
  parent?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  group: ResourceGroup;
}

export interface Schedule {
  id: string;
  username: string;
  startDateTime: string;
  endDateTime: string;
}

export interface Reservation {
  id: string;
  resourceItem: ResourceItem;
  startDateTime: string;
  endDateTime: string;
  reservedBy: string;
}
