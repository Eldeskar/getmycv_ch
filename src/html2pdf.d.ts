declare module 'html2pdf.js' {
  const html2pdf: () => {
    set: (opt: unknown) => { from: (el: HTMLElement) => { save: () => Promise<void> } }
  }
  export default html2pdf
}
