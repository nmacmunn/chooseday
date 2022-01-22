import { FakeDecision, FakeUser } from "../helpers/fake";

jest.unmock("../helpers/fake");

const runScript = () => jest.requireActual("../../src/util/name");

class Harness {
  get collaborator() {
    return new FakeUser({ id: "collaborator", email: "coll@borat.or" });
  }
  get creator() {
    return new FakeUser();
  }
  get currentUser() {
    return new FakeUser({ id: "current" });
  }
  get decision() {
    return new FakeDecision();
  }
}

describe("name util", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  describe("getName", () => {
    it("should return 'you' if user is currentUser", () => {
      const { currentUser, decision } = harness;
      const result = runScript().getName(currentUser, currentUser, decision);
      expect(result).toBe("you");
    });
    it("should return 'the creator' if user is creator", () => {
      const { currentUser, creator, decision } = harness;
      const result = runScript().getName(creator, currentUser, decision);
      expect(result).toBe("the creator");
    });
    it("should return email if user is a collaborator", () => {
      const { collaborator, currentUser, decision } = harness;
      const result = runScript().getName(collaborator, currentUser, decision);
      expect(result).toBe(collaborator.email);
    });
    it("should return 'a collaborator' if collaborator does not have email", () => {
      const { collaborator, currentUser, decision } = harness;
      collaborator.email = undefined;
      const result = runScript().getName(collaborator, currentUser, decision);
      expect(result).toBe("a collaborator");
    });
    describe("uppercase", () => {
      it("should return 'You' if user is currentUser", () => {
        const { currentUser, decision } = harness;
        const result = runScript().getName(
          currentUser,
          currentUser,
          decision,
          true
        );
        expect(result).toBe("You");
      });
      it("should return 'The creator' if user is creator", () => {
        const { currentUser, creator, decision } = harness;
        const result = runScript().getName(
          creator,
          currentUser,
          decision,
          true
        );
        expect(result).toBe("The creator");
      });
      it("should return email if user is a collaborator", () => {
        const { collaborator, currentUser, decision } = harness;
        const result = runScript().getName(
          collaborator,
          currentUser,
          decision,
          true
        );
        expect(result).toBe(collaborator.email);
      });
      it("should return 'A collaborator' if collaborator does not have email", () => {
        const { collaborator, currentUser, decision } = harness;
        collaborator.email = undefined;
        const result = runScript().getName(
          collaborator,
          currentUser,
          decision,
          true
        );
        expect(result).toBe("A collaborator");
      });
    });
  });
  describe("getNames", () => {
    it("should return an empty string if no users are specified", () => {
      const { currentUser, decision } = harness;
      const result = runScript().getNames([], currentUser, decision);
      expect(result).toBe("");
    });
    it("should return a single name if one user is specified", () => {
      const { collaborator, currentUser, decision } = harness;
      const result = runScript().getNames(
        [collaborator],
        currentUser,
        decision
      );
      expect(result).toBe(collaborator.email);
    });
    it("should return two names if two users are specified", () => {
      const { collaborator, currentUser, decision } = harness;
      const result = runScript().getNames(
        [collaborator, currentUser],
        currentUser,
        decision
      );
      expect(result).toBe(`you and ${collaborator.email}`);
    });
    it("should return two names and one other if three users are specified", () => {
      const { collaborator, creator, currentUser, decision } = harness;
      const result = runScript().getNames(
        [collaborator, creator, currentUser],
        currentUser,
        decision
      );
      expect(result).toBe("you, the creator, and 1 other");
    });
    it("should return two names and x others if for or more users are specified", () => {
      const { collaborator, creator, currentUser, decision } = harness;
      const other = new FakeUser({ id: "other" });
      const result = runScript().getNames(
        [collaborator, creator, currentUser, other],
        currentUser,
        decision
      );
      expect(result).toBe("you, the creator, and 2 others");
    });
    describe("uppercase", () => {
      it("should return an empty string if no users are specified", () => {
        const { currentUser, decision } = harness;
        const result = runScript().getNames([], currentUser, decision, true);
        expect(result).toBe("");
      });
      it("should return a single name if one user is specified", () => {
        const { collaborator, currentUser, decision } = harness;
        const result = runScript().getNames(
          [collaborator],
          currentUser,
          decision,
          true
        );
        expect(result).toBe(collaborator.email);
      });
      it("should return two names if two users are specified", () => {
        const { collaborator, currentUser, decision } = harness;
        const result = runScript().getNames(
          [collaborator, currentUser],
          currentUser,
          decision,
          true
        );
        expect(result).toBe(`You and ${collaborator.email}`);
      });
      it("should return two names and one other if three users are specified", () => {
        const { collaborator, creator, currentUser, decision } = harness;
        const result = runScript().getNames(
          [collaborator, creator, currentUser],
          currentUser,
          decision,
          true
        );
        expect(result).toBe("You, the creator, and 1 other");
      });
      it("should return two names and x others if for or more users are specified", () => {
        const { collaborator, creator, currentUser, decision } = harness;
        const other = new FakeUser({ id: "other" });
        const result = runScript().getNames(
          [collaborator, creator, currentUser, other],
          currentUser,
          decision,
          true
        );
        expect(result).toBe("You, the creator, and 2 others");
      });
    });
  });
  describe("getPossessive", () => {
    it("should return 'your' if user is currentUser", () => {
      const { currentUser, decision } = harness;
      const result = runScript().getPossessive(
        currentUser,
        currentUser,
        decision
      );
      expect(result).toBe("your");
    });
    it("should return 'the creator's' if user is the creator", () => {
      const { currentUser, creator, decision } = harness;
      const result = runScript().getPossessive(creator, currentUser, decision);
      expect(result).toBe("the creator's");
    });
    describe("uppercase", () => {
      it("should return 'Your' if user is currentUser", () => {
        const { currentUser, decision } = harness;
        const result = runScript().getPossessive(
          currentUser,
          currentUser,
          decision,
          true
        );
        expect(result).toBe("Your");
      });
      it("should return 'The creator's' if user is the creator", () => {
        const { currentUser, creator, decision } = harness;
        const result = runScript().getPossessive(
          creator,
          currentUser,
          decision,
          true
        );
        expect(result).toBe("The creator's");
      });
    });
  });
});
