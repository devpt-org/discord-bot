import { ActionRowBuilderInterface } from "../../interface/action-row.builder.interface";

export interface ActionRowOptions {
  label: string;
  value: string;
  emoji?: string;
}

export abstract class AbstractActionRowBuilder<A> implements ActionRowBuilderInterface<A> {
  customId?: string;

  label?: string;

  style?: number;

  options?: ActionRowOptions[];

  setCustomId(customId: string): this {
    this.customId = customId;
    return this;
  }

  setLabel(label: string): this {
    this.label = label;
    return this;
  }

  setStyle(style: number): this {
    this.style = style;
    return this;
  }

  abstract setDangerStyle(): this;

  setOptions(options: ActionRowOptions[]): this {
    this.options = options;
    return this;
  }

  abstract build(): A;
}
