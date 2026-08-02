export type TeamProps = {
  id?: string;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  allTimeScored: number;
  allTimeConceded: number;
};

export class Team {
  private constructor(readonly props: TeamProps) {}

  public static create(
    name: string,
    colorPrimary: string,
    colorSecondary: string,
  ) {
    return new Team({
      name: required(name, "Team name"),
      colorPrimary: required(colorPrimary, "Primary color"),
      colorSecondary: required(colorSecondary, "Secondary color"),
      allTimeScored: 0,
      allTimeConceded: 0,
    });
  }

  public static restore(props: TeamProps & { id: string }) {
    return new Team(props);
  }

  public get id() { return this.props.id; }
  public get name() { return this.props.name; }
  public get colorPrimary() { return this.props.colorPrimary; }
  public get colorSecondary() { return this.props.colorSecondary; }
  public get allTimeScored() { return this.props.allTimeScored; }
  public get allTimeConceded() { return this.props.allTimeConceded; }
}

function required(value: string, field: string) {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}