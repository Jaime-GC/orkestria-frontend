export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETE';
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    type: 'URGENT' | 'RECURRING' | 'OTHER';
    status: 'TODO' | 'DOING' | 'BLOCKED' | 'DONE';
    projectId: string;
    assignedUser?: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'EMPLOYEE' | 'CLIENT';
}

export interface ResourceGroup {
  id: number;
  name: string;
  parentId?: number;
}


export interface Schedule {
  id: string;
  username: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
}

export interface Reservation {
  id: string;
  title: string;
  resourceGroup: ResourceGroup;
  startDateTime: string;
  endDateTime: string;
  reservedBy: string;
}