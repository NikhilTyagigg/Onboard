import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteRight, faListNumeric, faList } from '@fortawesome/free-solid-svg-icons'
import './index.scss'
// class TextEditor extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {editorState: EditorState.createEmpty()};

//       this.focus = () => this.refs.editor.focus();
//       this.onChange = (editorState) => this.setState({editorState});

//       this.handleKeyCommand = this._handleKeyCommand.bind(this);
//       this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
//       this.toggleBlockType = this._toggleBlockType.bind(this);
//       this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
//     }

//     _handleKeyCommand(command, editorState) {
//       const newState = RichUtils.handleKeyCommand(editorState, command);
//       if (newState) {
//         this.onChange(newState);
//         return true;
//       }
//       return false;
//     }

//     _mapKeyToEditorCommand(e) {
//       if (e.keyCode === 9 /* TAB */) {
//         const newEditorState = RichUtils.onTab(
//           e,
//           this.state.editorState,
//           4, /* maxDepth */
//         );
//         if (newEditorState !== this.state.editorState) {
//           this.onChange(newEditorState);
//         }
//         return;
//       }
//       return getDefaultKeyBinding(e);
//     }

//     _toggleBlockType(blockType) {
//       this.onChange(
//         RichUtils.toggleBlockType(
//           this.state.editorState,
//           blockType
//         )
//       );
//     }

//     _toggleInlineStyle(inlineStyle) {
//       this.onChange(
//         RichUtils.toggleInlineStyle(
//           this.state.editorState,
//           inlineStyle
//         )
//       );
//     }

//     render() {
//       const {editorState} = this.state;
//       let className = 'RichEditor-editor';
//       var contentState = editorState.getCurrentContent();
//       if (!contentState.hasText()) {
//         if (contentState.getBlockMap().first().getType() !== 'unstyled') {
//           className += ' RichEditor-hidePlaceholder';
//         }
//       }

//       return (
//         <div className="RichEditor-root">
//           <BlockStyleControls
//             editorState={editorState}
//             onToggle={this.toggleBlockType}
//           />
//           <InlineStyleControls
//             editorState={editorState}
//             onToggle={this.toggleInlineStyle}
//           />
//           <div className={className} onClick={this.focus}>
//             <Editor
//               blockStyleFn={getBlockStyle}
//               customStyleMap={styleMap}
//               editorState={editorState}
//               handleKeyCommand={this.handleKeyCommand}
//               keyBindingFn={this.mapKeyToEditorCommand}
//               onChange={this.onChange}
//               placeholder="Let's get started"
//               ref="editor"
//               spellCheck={true}
//             />
//           </div>
//         </div>
//       );
//     }
//   }

  // Custom overrides for "code" style.
  const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    B: {
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      fontWeight: 'bold',
      padding: 2,
    },
    U: {
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      textDecoration: 'underline',
      padding: 2,
    },
    I: {
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      fontStyle: 'italic',
      padding: 2,
    }
  };

  function getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  class StyleButton extends React.Component {
    constructor() {
      super();
      this.onToggle = (e) => {
        e.preventDefault();
        this.props.onToggle(this.props.style);
      };
    }

    renderLable = () => {
      switch(this.props.label){
        case "Blockquote": return <FontAwesomeIcon icon={faQuoteRight} />;break;
        case "OL": return <FontAwesomeIcon icon={faListNumeric} />;break;
        case "UL": return <FontAwesomeIcon icon={faList} />;break;
        default : return this.props.label
      }
    }

    render() {
      let className = 'RichEditor-styleButton';
      if (this.props.active) {
        className += ' RichEditor-activeButton';
      }

      return (
        <span className={className} onMouseDown={this.onToggle}>
          <span style={styleMap[this.props.label]?styleMap[this.props.label]:{}}>
            {this.renderLable()}
          </span>
        </span>
      );
    }
  }

  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    // {label: 'H5', style: 'header-five'},
    // {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    // {label: 'Code Block', style: 'code-block'},
  ];

  export const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };

  var INLINE_STYLES = [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'U', style: 'UNDERLINE'},
    // {label: 'Monospace', style: 'CODE'},
  ];

  export  const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();
    
    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map((type) =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };