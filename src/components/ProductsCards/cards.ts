export interface Card {
  id: string;
  className: string;
  title: string;
  text: string;
  link: string;
}

export function getCards(isHomePage: boolean = false): Card[] {
  return [
    {
      id: 'dispenser',
      className: 'dispenserImg',
      title: 'Tape dispensers',
      link: '/',
      text: isHomePage
        ? `Available in different bandwidth sizes: 24/25, 36 and 38 mm. Easy and accurate appliance. 
        Straight lines and precisely cut in the corner. Fit for most tape brands.`
        : `With the QuiP® tape dispenser masking tape can be applied accurately 
        and tape precisely cut in the corner. Works 3 - 4 times faster and more precise.`,
    },
    {
      id: 'systainer',
      className: 'systainerImg',
      title: 'Systainer',
      link: '/',
      text: isHomePage
        ? `QuiP delivers the Systainer standard with a foam inlay for tape and dispenser. 
        A linkable case system for the profi, trade and industry. Always neatly organised.`
        : `The QuiP® systainer makes your work better organized and 
        gives you direct entry to you tools and accessoires.`,
    },
    // {
    //   id: 'maskingtape',
    //   className: 'maskingtapeImg',
    //   title: 'Masking tape',
    //   link: '/',
    //   text: isHomePage
    //     ? `We advise to use high performance tapes that create sharp painting lines.
    //     Use different tapes for different surfaces. Go for the best result! QuiP washi tape.`
    //     : `Sharp painting lines and no residue are the result
    //     when removing the QuiP maskingtape after the paint is dry.`,
    // },
  ];
}
