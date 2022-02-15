export interface Collaborator extends User {
  active: boolean;
  email: string;
}

export interface Criterion {
  decisionId: string;
  id: string;
  title: string;
  user: User;
  weight: number;
}

export interface Decision {
  created: number;
  creator: User;
  collaborators: Record<string, Collaborator> | undefined;
  id: string;
  title: string;
}

export interface Option {
  created: number;
  decisionId: string;
  id: string;
  title: string;
}

export interface Rating {
  criterionId: string;
  decisionId: string;
  id: string;
  optionId: string;
  user: User;
  weight: number;
}

export interface User {
  id: string;
  email?: string;
}
