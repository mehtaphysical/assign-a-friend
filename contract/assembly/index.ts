import {
  Context,
  ContractPromise,
  ContractPromiseBatch,
  math,
  PersistentMap,
  u128,
} from "near-sdk-as";

@nearBindgen
class Assignment {
  assignerId: string;
  assigneeId: string;
  text: string;
  answer: string;
  payment: u128; // u128 is a 128 bit unsigned number (e.g. u32, i32)
}

// a Map is loaded into memory in full
// a PersistentMap only loads the values you ask for into memory
const assignments: PersistentMap<string, Assignment> = new PersistentMap<
  string,
  Assignment
>("a");

// createAssignment -> tell a friend to do something
export function createAssignment(accountId: string, text: string): string {
  // create a unique(ish) id for the assignment
  const id = math.hash32<string>(Context.sender + accountId + text).toString();

  // insert the assignment into the blockchain
  assignments.set(id, {
    assignerId: Context.sender,
    assigneeId: accountId,
    text: text,
    answer: "",
    payment: Context.attachedDeposit,
  });

  // return the id for the newly inserted assignment
  return id;
}

// getAssignment -> a friend to see their assignment
export function getAssignment(id: string): Assignment {
  assert(assignments.contains(id), "No assignment with that id exists");

  return assignments.getSome(id);
}

// completeAssignment -> a friend to finish an assignment
export function completeAssignment(id: string, answer: string): void {
  assert(assignments.contains(id), "No assignment with that id exists");
  const assignment = assignments.getSome(id);

  assert(Context.sender == assignment.assigneeId, "You are not the assignee");

  assignment.answer = answer;
  assignments.set(id, assignment);
}

// closeAssignment -> pay a friend if they finished the assignment correctly
export function closeAssignment(id: string): void {
  assert(assignments.contains(id), "No assignment with that id exists");
  const assignment = assignments.getSome(id);

  assert(Context.sender == assignment.assignerId, "You are not the assigner");

  ContractPromiseBatch.create(assignment.assigneeId).transfer(
    assignment.payment
  );

  assignments.delete(id);
}
