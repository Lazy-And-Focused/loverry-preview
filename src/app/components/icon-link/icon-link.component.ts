import type { InputSignal } from '@angular/core';
import { Component, Input, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

export const LINKS = {
  lafTelegram: {
    href: 'http://t.me/laf_love',
    icon: 'bootstrapTelegram',
  },

  lafGithub: {
    href: 'http://github.com/lazy-and-focused',
    icon: 'bootstrapGithub',
  },

  lafSite: {
    href: 'http://laf-team.ru',
    icon: 'heroGlobeAlt',
  },

  fockustyDiscord: {
    href: 'https://discord.gg/97J8mnn4Gr',
    icon: 'bootstrapDiscord',
  },

  fockustyTelegram: {
    href: 'http://t.me/fockusty',
    icon: 'bootstrapTelegram',
  },

  fockustyGithub: {
    href: 'http://github.com/fockusty',
    icon: 'bootstrapGithub',
  },

  fockustySite: {
    href: 'http://fockusty.vercel.app',
    icon: 'heroGlobeAlt',
  },
} as const satisfies Record<string, { href: string; icon: string }>;

@Component({
  selector: 'icon-link',
  imports: [NgIcon],
  templateUrl: './icon-link.html',
})
export class IconLink {
  public readonly links = LINKS;

  @Input({ required: true })
  public link!: keyof typeof LINKS;
  public size: InputSignal<number> = input<number>(24);

  public constructor() {}
}
