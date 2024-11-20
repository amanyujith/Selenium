const linkifyText = (text: string): string =>  {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
  
    return text.replace(linkRegex, (url) => {

      if (/<a\s+(?:[^>]*?\s+)?href=(["'])(?:.*?\1)?\s*>.*?<\/a>/i.test(url)) {
        return url;
      } else {
      return `<a  href="${url}" target="_blank" rel="noopener noreferrer"  style="color:#004B91;" >${url}</a>`;
}});
  }

export default linkifyText