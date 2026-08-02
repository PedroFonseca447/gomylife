export type TournamentProps = {
  id?: string;
  name: string;
  country: string;
  year: string;
};

export class Tournament {
  private constructor(readonly props: TournamentProps) {}

  public static create(name: string, country: string, year: string) {
    return new Tournament({
      name: required(name, "Tournament name"),
      country: required(country, "Tournament country"),
      year: required(year, "Tournament year"),
    });
  }

  public static restore(props: TournamentProps & { id: string }) {
    return new Tournament(props);
  }

  public get id() { return this.props.id; }
  public get name() { return this.props.name; }
  public get country() { return this.props.country; }
  public get year() { return this.props.year; }
}

function required(value: string, field: string) {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}