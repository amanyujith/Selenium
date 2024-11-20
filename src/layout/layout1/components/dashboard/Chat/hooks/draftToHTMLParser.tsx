import React, { useRef, useState } from "react";
import { EditorState, convertFromRaw, ContentBlock } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Linkify from "linkify-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MiniProfileModal from "../chatContainer/miniProfileModal";
import { actionCreators } from "../../../../../../store";
import useOutsideClick from "../hooks/useOutsideClick ";

interface DraftParserProps {
  rawObject: any;
  isSearch?: boolean;
  isPinned?: boolean;
  type?: any;
  quadrant?: any;
}

const DraftParser: React.FC<DraftParserProps> = React.memo(
  ({ rawObject, isSearch, isPinned, type, quadrant }) => {
    const contentState = convertFromRaw(rawObject);
    const editorState = EditorState.createWithContent(contentState);
    const miniUuid = useSelector((state: any) => state.Chat.setMentionUuid);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedInUserInfo = useSelector(
      (state: any) => state.Main.loggedInUserInfo
    );
    const [modal, setmodal] = useState<any>("");
    const emojiRegex =
      /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
    const regex = /[0-9#]/;
    const miniProfileModalref = useRef<null | HTMLDivElement>(null);
    const closeMiniProfileModal = () => {
      setmodal("");
      dispatch(actionCreators.setMentionUuid(""));
    };
    useOutsideClick(miniProfileModalref, closeMiniProfileModal);

    const options = {
      blockStyleFn: (block: ContentBlock) => {
        const content = block.getText().trim();
        const type = block?.get("type");
        if (emojiRegex.test(content) && !regex.test(content)) {
          return {
            style: {
              fontSize: "30px",
              marginTop: isSearch ? "10px" : "0px",
            },
          };
        }
        if (
          !content &&
          type !== "ordered-list-item" &&
          type !== "unordered-list-item"
        ) {
          return {
            style: {
              height: "8px",
            },
          };
        }
      },
      entityStyleFn: (entity: any) => {
        const entityType = entity.get("type").toLowerCase();
        if (entityType === "mention") {
          const data = entity.getData();
          return {
            element: "mention",
            attributes: {
              id: "mention",
              entityData: JSON.stringify(data),
            },
          };
        }
      },

      inlineStyles: {
        BOLD: { element: "b" },
      },
    };

    const mentionHoverOn = (mention: any, index: any) => {
      setmodal(
        mention.user_id ? mention.user_id + index : mention.uuid + index
      );
      dispatch(
        actionCreators.setMentionUuid(
          mention.user_id ? mention.user_id : mention.uuid
        )
      );
    };

    const html = stateToHTML(editorState.getCurrentContent(), options);

    const parseHTML = (html: string) => {
      const parser = new DOMParser();
      const parsedHTML = parser.parseFromString(html, "text/html");
      return parsedHTML.body.childNodes;
    };

    const renderParsedHTML = (
      nodes: NodeListOf<ChildNode>,
      isStart = true
    ): React.ReactNode[] => {
      return Array.from(nodes).map((node, index) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const trimmedTextContent =
            index === 0 ? node.textContent?.trimStart() : node.textContent; // Trim leading and trailing spaces
          const isEmoji = /\p{Emoji}/u.test(trimmedTextContent || "");
          const emojiRegex =
            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
          if (trimmedTextContent) {
            const parts = trimmedTextContent.split(emojiRegex);
            const result = (
              <span>
                {parts.map((part, index) => {
                  if (part.match(emojiRegex)) {
                    return (
                      <span style={{ fontStyle: "normal" }} key={index}>
                        {part}
                      </span>
                    );
                  } else {
                    return part;
                  }
                })}
              </span>
            );

            return trimmedTextContent
              ? isEmoji
                ? result
                : trimmedTextContent
              : null;
          }
          return trimmedTextContent
            ? isEmoji
              ? trimmedTextContent
              : trimmedTextContent
            : null;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const ElementTag = (node as Element).tagName.toLowerCase();
          if (ElementTag === "br") {
            return <br key={index} />;
          } else if (ElementTag === "img") {
            // const attributes: { [key: string]: string | object } = Array.from(
            //   (node as Element).attributes
            // ).reduce((props: { [key: string]: string | object }, attribute) => {
            //   props[attribute.name] = attribute.value;
            //   return props;
            // }, {});
            return null;
          } else if (ElementTag === "a") {
            const href = (node as Element).getAttribute("href") || "";
            return (
              <a
                className="text-[#004B91]"
                target="_blank"
                rel="noreferrer"
                href={href}
              >
                {node.textContent}
              </a>
            );
          } else if (ElementTag === "mention") {
            const entityDataString = (node as Element).getAttribute(
              "entityData"
            );
            if (entityDataString) {
              const { mention } = JSON.parse(entityDataString);
              return (
                <span
                  onClick={() => {
                    mentionHoverOn(mention, index);
                  }}
                  // onMouseLeave={() => {
                  //   setmodal("")
                  //   dispatch(actionCreators.setMentionUuid(""))
                  // }}
                  className="w-full h-full relative"
                >
                  <span className={` bg-[#dbeaf7] p-[4px] cursor-pointer`}>
                    {node.textContent}
                  </span>

                  {modal === mention.uuid + index &&
                    mention.uuid !== loggedInUserInfo?.sub &&
                    isPinned !== true &&
                    type !== "reply" ? (
                    <div ref={miniProfileModalref} className="">
                      <MiniProfileModal
                        setmodal={setmodal}
                        mention={mention}
                        isGroup={false}
                        mentionFlag={true}
                        grpHover={false}
                        quadrant={quadrant}
                      />
                    </div>
                  ) : null}
                </span>
              );
            } else {
              return (
                <span className="text-[#004B91]">@{node.textContent}</span>
              );
            }
          }

          const attributes: { [key: string]: string | object } = Array.from(
            (node as Element).attributes
          ).reduce((props: { [key: string]: string | object }, attribute) => {
            if (attribute.name === "style") {
              // Handle style attribute
              const styleObject: { [key: string]: string } = {};
              attribute.value.split(";").forEach((styleItem) => {
                const [property, value] = styleItem.split(":");
                styleObject[property.trim()] = value.trim();
              });
              props.style = styleObject;
            } else {
              props[attribute.name] = attribute.value;
            }
            return props;
          }, {});
          if (ElementTag === "code" && node.textContent) {
            attributes["style"] = codeStyle;
          }
          if (ElementTag === "a") {
            attributes["style"] = customHrefStyle;
          }
          // if (ElementTag === 'p') {
          //   attributes['style'] =  { paddingBottom : "8px"};
          // }

          return React.createElement(
            ElementTag,
            { key: index, ...attributes },
            renderParsedHTML(node.childNodes)
          );
        }
        return null;
      });
    };

    const parsedHTML = parseHTML(html);

    return (
      <div>
        {" "}
        <Linkify options={linkifyOptions}>
          {renderParsedHTML(parsedHTML)}
        </Linkify>
      </div>
    );
  }
);

export default DraftParser;

const linkifyOptions = {
  className: "text-[#004B91]",
  target: "_blank",
  // render: {
  //   url: ({ attributes , content   } : {attributes :any , content : any}) => {
  //     return <a  style= {{color : "#004B91"}} {...attributes}>{content}</a>;
  //   }}
};

const codeStyle = {
  background: "#f4f4f4",
  border: "1px solid #ddd",
  borderLeft: "3px solid #f36d33",
  color: "#666",
  pageBreakInside: "avoid",
  fontFamily: "monospace",
  fontSize: "15px",
  lineHeight: "1.6",
  maxWidth: "100%",
  padding: "1em 1.5em",
  display: "block",
  wordWrap: "break-word",
};

const customHrefStyle = {
  color: "#004B91",
  paddingLeft: ".5em",
};
