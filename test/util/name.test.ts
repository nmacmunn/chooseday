import { FakeDecision, FakeUser } from "../fake";

jest.unmock("../fake");

const runScript = () => jest.requireActual("../../src/util/name");

describe("name util", () => {
  describe("getName", () => {
    it("should return You if user is currentUser", () => {
      const user = new FakeUser();
      const decision = new FakeDecision();
      const result = runScript().getName(user, user, decision);
      expect(result).toBe("You");
    });
    it("should return Creator if user is creator", () => {
      const user = new FakeUser();
      const currentUser = new FakeUser({ id: "current" });
      const decision = new FakeDecision();
      const result = runScript().getName(user, currentUser, decision);
      expect(result).toBe("Creator");
    });
    it("should return email if user has email", () => {
      const user = new FakeUser({ id: "collaborator", email: "coll@borat.or" });
      const currentUser = new FakeUser();
      const decision = new FakeDecision();
      const result = runScript().getName(user, currentUser, decision);
      expect(result).toBe("coll@borat.or");
    });
    it("should default to Collaborator", () => {
      const user = new FakeUser({ id: "collaborator" });
      const currentUser = new FakeUser();
      const decision = new FakeDecision();
      const result = runScript().getName(user, currentUser, decision);
      expect(result).toBe("Collaborator");
    });
  });
});
