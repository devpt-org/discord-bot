export interface ActionRowOptions {
  label: string;
  value: string;
  emoji?: string;
}

export interface ActionRowBuilderInterface<A> {
  customId?: string;
  label?: string;
  style?: number;
  options?: ActionRowOptions[];

  setCustomId(customId: string): this;

  setLabel(label: string): this;

  setStyle(style: number): this;

  setDangerStyle(): this;

  setOptions(options: ActionRowOptions[]): this;

  build(): A;
}
