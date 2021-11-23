export interface Criterion {
  id: string;
  decisionId: string;
  user: User;
  title: string;
  weight: number;
}

export interface Decision {
  id: string;
  created: number;
  creator: User;
  collaborators: string[];
  title: string;
}

export interface Option {
  id: string;
  created: number;
  decisionId: string;
  title: string;
}

export interface Rating {
  id: string;
  criterionId: string;
  decisionId: string;
  optionId: string;
  user: User;
  weight: number;
}

export interface User {
  id: string;
  email?: string;
}
