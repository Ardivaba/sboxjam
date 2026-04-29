type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  teamId?: string;
  registeredForJam: boolean;
  createdAt: string;
};

type Team = {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  members: { id: string; username: string; role: "leader" | "member" }[];
  maxMembers: number;
  inviteCode: string;
  createdAt: string;
};

const users: Map<string, User> = new Map();
const teams: Map<string, Team> = new Map();

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const db = {
  users: {
    findByEmail(email: string): User | undefined {
      return Array.from(users.values()).find((u) => u.email === email);
    },
    findById(id: string): User | undefined {
      return users.get(id);
    },
    create(data: { username: string; email: string; passwordHash: string }): User {
      const user: User = {
        id: generateId(),
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        registeredForJam: false,
        createdAt: new Date().toISOString(),
      };
      users.set(user.id, user);
      return user;
    },
    update(id: string, data: Partial<User>): User | undefined {
      const user = users.get(id);
      if (!user) return undefined;
      Object.assign(user, data);
      users.set(id, user);
      return user;
    },
  },

  teams: {
    findAll(): Team[] {
      return Array.from(teams.values());
    },
    findById(id: string): Team | undefined {
      return teams.get(id);
    },
    findByInviteCode(code: string): Team | undefined {
      return Array.from(teams.values()).find((t) => t.inviteCode === code);
    },
    findByMemberId(userId: string): Team | undefined {
      return Array.from(teams.values()).find((t) =>
        t.members.some((m) => m.id === userId)
      );
    },
    create(data: { name: string; description: string; leaderId: string; leaderName: string }): Team {
      const team: Team = {
        id: generateId(),
        name: data.name,
        description: data.description,
        leaderId: data.leaderId,
        members: [{ id: data.leaderId, username: data.leaderName, role: "leader" }],
        maxMembers: 4,
        inviteCode: generateInviteCode(),
        createdAt: new Date().toISOString(),
      };
      teams.set(team.id, team);
      return team;
    },
    addMember(teamId: string, userId: string, username: string): Team | undefined {
      const team = teams.get(teamId);
      if (!team) return undefined;
      if (team.members.length >= team.maxMembers) return undefined;
      team.members.push({ id: userId, username, role: "member" });
      teams.set(teamId, team);
      return team;
    },
    removeMember(teamId: string, userId: string): Team | undefined {
      const team = teams.get(teamId);
      if (!team) return undefined;
      team.members = team.members.filter((m) => m.id !== userId);
      if (team.members.length === 0) {
        teams.delete(teamId);
        return undefined;
      }
      if (team.leaderId === userId) {
        team.leaderId = team.members[0].id;
        team.members[0].role = "leader";
      }
      teams.set(teamId, team);
      return team;
    },
  },
};
