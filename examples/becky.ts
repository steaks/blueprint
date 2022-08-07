/*
Vision:
- System that creates a visual representation of the architecture
- As a user:
    - Looking at the visualization, I can see:
        - Pieces of work
        - Dependencies between those pieces
        - Inputs and outputs
    - I can define the pieces of work at whatever granularity I wish
    - I can drill down into a piece of work and see the pieces that comprise it (i.e. zoom in, zoom out to change level of detail)
- As a user, I cannot:
    - Use the system to schedule work
    - Enact any code changes via the UI

Farther future, out of scope:
- UI-first development
*/

/*
Input: Pie type
Output: Person's name

*/

import blueprint from "blueprint";

type GetEater = (pieType: string) => string;
const getEater: GetEater = pieType => {
  if (pieType === "blueberry") {
    return "Steven";
  } else if (pieType === "apple") {
    return "Becky";
  } else {
    return "Robin1";
  }
};

const steven = () => "Steven";
const becky = () => "Becky";
const robin1 = () => "Robin1";

// Airflow-esque implementation
interface Task {
  readonly id: string;
  // readonly fn: () => string;
}

const Steven: Task = { id: "steven" };
const Becky: Task = { id: "becky" };
const Robin1: Task = { id: "robin1" };

type GetEater2 = (pieType: string) => Task;
const getEater2: GetEater2 = pieType => {
  if (pieType === "blueberry") {
    return steven;
  } else if (pieType === "apple") {
    return becky;
  } else {
    return robin1;
  }
};

blueprint
    .condition(getTask)
    .operators([steven, becky, robin1]);

const isBlueberry = (pieType: string) => pieType === "blueberry";
const isApple = (pieType: string) => pieType === "blueberry";

blueprint
  .if(isBlueberry, steven)
  .elseif(isApple, becky)
  .else(robin1);

blueprint
  .switch((pieType: string) => pieType)
  .case("blueberry", steven)
  .case("apple", becky)
  .default(robin1);

blueprint
    .branches([steven, becky, robin1])
    .choose((pieType: string, branches: [steven, becky, robin]) => {
        if (pieType === "blueberry") {
            return steven;
        } else if (pieType === "apple") {
            return becky;
        } else {
            return robin1;
        }
    });

/*

  -> B ->
A         D
  -> C ->
*/

interface BeckyNode {
  readonly id: string;
  readonly nodes: BeckyNode[];
}

const D: BeckyNode = { id: "B", nodes: [] }
const C: BeckyNode = { id: "C", nodes: [D] }
const B: BeckyNode = { id: "B", nodes: [D] }
const A: BeckyNode = { id: "A", nodes: [B, C] }
