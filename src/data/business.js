/* Spa Rivier opened in 1985 (founded by Donna Jacobsen; Quesnel Cariboo
   Observer, January 2026). Every "N years" on the site is counted from
   this, so the figure moves on by itself each January and the pages
   cannot drift apart again. */
export const FOUNDED_YEAR = 1985

export const yearsInBusiness = () => new Date().getFullYear() - FOUNDED_YEAR
