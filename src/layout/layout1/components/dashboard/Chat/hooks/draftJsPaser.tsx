import React from "react";
import Linkify from "linkify-react";
import runes from "runes";

interface InlineStyleRange {
  offset: number;
  length: number;
  style: string;
}

interface Block {
  key: string;
  text: string;
  type: string;
  inlineStyleRanges: InlineStyleRange[];
  data?: {
    children: Block[];
  };
}

interface RawObject {
  blocks: Block[];
}

// Parser component
const DraftJSParser: React.FC<{ rawObject: RawObject }> = React.memo(
  ({ rawObject }) => {
    let listDepth = 0; // Track the depth of nested lists
    let orderedListCounters: number[] = []; // Track counters for ordered lists

    const renderContent = (): JSX.Element[] => {
      return rawObject.blocks.map((block) => {
        const { key, text, type, inlineStyleRanges, data } = block;

        if (type === "unordered-list-item") {
          listDepth++;
          const nestedBlocks = data?.children || [];
          const listItems = nestedBlocks.map((nestedBlock) => (
            <li key={nestedBlock.key}>{renderContentRecursive(nestedBlock)}</li>
          ));
          listDepth--;

          return (
            <ul key={key} style={{ marginLeft: `${listDepth * 20}px` }}>
              <li>
                {renderTextWithStyles(text, inlineStyleRanges)}
                <ul>{listItems}</ul>
              </li>
            </ul>
          );
        }

        if (type === "ordered-list-item") {
          const counterIndex = listDepth - 1;
          orderedListCounters[counterIndex] =
            orderedListCounters[counterIndex] || 0;
          orderedListCounters[counterIndex]++;

          return (
            <li className="list-none">
              <span>{orderedListCounters[counterIndex]}. </span>
              {renderTextWithStyles(text, inlineStyleRanges)}
            </li>
          );
        }
        if (type === "code-block") {
          return (
            <pre key={key} className={codeStyle}>
              <code>{text}</code>
            </pre>
          );
        }

        // Handle unstyled blocks with inline style ranges
        if (type === "unstyled" && inlineStyleRanges.length > 0) {
          return (
            <div key={key}>{renderTextWithStyles(text, inlineStyleRanges)}</div>
          );
        }

        // Handle unstyled blocks without inline style ranges
        return (
          <div key={key} className={type}>
            {text}
            {/* {linkifyHtml(text, linkifyOptions)} */}
          </div>
        );
      });
    };

    const renderContentRecursive = (block: Block): JSX.Element => {
      const { key, text, type, inlineStyleRanges } = block;

      if (type === "unordered-list-item" || type === "ordered-list-item") {
        return (
          <li key={key} style={{ marginLeft: `${listDepth * 20}px` }}>
            {renderTextWithStyles(text, inlineStyleRanges)}
            <ul>
              {block.data?.children?.map((nestedBlock) => (
                <li key={nestedBlock.key}>
                  {renderContentRecursive(nestedBlock)}
                </li>
              ))}
            </ul>
          </li>
        );
      }

      if (type === "code-block") {
        return (
          <pre
            key={key}
            className={codeStyle}
          >
            <code>{text}</code>
          </pre>
        );
      }

      // Handle unstyled blocks with inline style ranges
      if (type === "unstyled" && inlineStyleRanges.length > 0) {
        return (
          <div key={key}>{renderTextWithStyles(text, inlineStyleRanges)}</div>
        );
      }

      // Handle unstyled blocks without inline style ranges
      return (
        <div key={key} className={type}>
          {text}
        </div>
      );
    };


    const renderTextWithStyles = (
      text: string,
      inlineStyleRanges: InlineStyleRange[]
    ): JSX.Element[] => {
      const styleMap: Record<string, React.CSSProperties> = {
        BOLD: { fontWeight: "bold" },
        ITALIC: { fontStyle: "italic" },
        CODE: {
          fontFamily: "monospace",
          backgroundColor: "#f1f1f1",
          padding: "2px 4px",
        },
      };
    
      const styledText: JSX.Element[] = [];
      let currentIndex = 0;
      const visitedRanges = new Set<number>();
    
      for (const styleRange of inlineStyleRanges) {
        const { offset, length, style } = styleRange;
    
        // Skip visited ranges to avoid duplication
        if (visitedRanges.has(offset)) {
          continue;
        }
    
        // Push unstyled text before the current style range
        if (currentIndex < offset) {
          const unstyledText =  runes.substr(text,currentIndex, offset );
          styledText.push(<span key={currentIndex}>{unstyledText}</span>);
        }
    
        const styleObj = styleMap[style] || {};
    
        // Check if there are overlapping styles
        const overlappingRanges = inlineStyleRanges.filter(
          (range) =>
            range.offset < offset + length &&
            range.offset + range.length > offset &&
            !visitedRanges.has(range.offset)
        );
          
            // Apply all the relevant styles to the substring
        let styledSubstring = (
          <span key={offset} style={styleObj}>
           {runes.substr(text,offset, offset +length )}
          </span>
        );
    
        // Apply the overlapping styles as nested spans
        if (overlappingRanges.length > 1) {
          overlappingRanges.forEach((range) => {
            const nestedStyleObj = styleMap[range.style] || {};
           // 

            visitedRanges.add(range.offset); // Mark as visited
            styledSubstring = (
              <span key={offset} style={nestedStyleObj}>
                {styledSubstring}
              </span>
            );
          });
        }
    
        visitedRanges.add(offset); // Mark as visited
        styledText.push(styledSubstring);
        currentIndex = offset + length;
      }
    
      // Push remaining unstyled text after the last style range
      if (currentIndex < text.length) {
        const unstyledText =   runes.substr(text,currentIndex );
        styledText.push(<span key={currentIndex}>{unstyledText}</span>);
      }
  
      return styledText;
    };
    


    return (
      <div>
        <Linkify options={linkifyOptions}>{renderContent()}</Linkify>
      </div>
    );
  }
);

export default DraftJSParser;


    // style for code-block
const codeStyle =       
  "border text-[#666] break-inside-avoid text-[15px] leading-[1.6] max-w-full overflow-auto block  px-[1em] py-[0.6em] border-l-[3px] border-l-[#b5b6b7] border-solid border-[#ddd] bg-[#f4f4f4] break-word";

const linkifyOptions = {
  className: "text-[#004B91]",
  target: "_blank",
};