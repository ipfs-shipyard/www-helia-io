import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LiveEditor from '../react-live/live-editor.jsx'
import Svg from '../svg/index.jsx'
import Button from '../button/index.jsx'
// import Link from '../link/index.jsx'
// import SyntaxHighlighter from '../syntax-highlighter/index.jsx'
import ReactMarkdown from 'react-markdown'
import {
  runCode,
  log,
  createHelia,
  codeAdd,
  codeGet
} from '../../utils/react-live.js'
import hexagonsSvg from '../../media/images/hexagons.sprite.svg'
import styles from './index.module.css'
import { CID } from 'multiformats/cid'
import { strings } from '@helia/strings'

const ADD_CODE_DATA = 'Hello, <YOUR NAME HERE>'
// stands in for the CID until the "add" example has been run and produced a real one
const GET_CODE_CID_PLACEHOLDER = '<YOUR CID HERE>'
// the CID literal in the "get" snippet, so we can check it before running the code
const GET_CODE_CID_PATTERN = /CID\.parse\(\s*'([^']*)'\s*\)/

function isValidCid (str) {
  try {
    CID.parse(str)
    return true
  } catch (err) {
    return false
  }
}

class GettingStarted extends Component {
  state = {
    codeAdd: codeAdd(ADD_CODE_DATA).trim(),
    codeGet: codeGet(GET_CODE_CID_PLACEHOLDER).trim(),
    outputAdd: '',
    outputGet: '',
    cid: ''
  }

  async componentDidMount () {
    try {
      this.helia = await createHelia()
    } catch (err) {
      console.log(err)
      return toast.error('Error getting IPFS')
    }
  }

  render () {
    const { intl: { messages } } = this.props
    const {
      cid,
      codeAdd,
      codeGet,
      outputAdd,
      outputGet
    } = this.state

    return (
      <div className={ styles.container } id="gsContainer">
        <div className={ styles.backgroundSvg }>
          <div className={ styles.hex1 }><Svg svg={ hexagonsSvg } /></div>
          <div className={ styles.hex2 }><Svg svg={ hexagonsSvg } /></div>
        </div>
        <div className={ styles.content }>
          <h1>{ messages.gettingStarted.sectionTitle }</h1>
          <ReactMarkdown className={ styles.sectionDescription }>{ messages.gettingStarted.sectionDesc }</ReactMarkdown>
          <div className={ styles.panel } >
            <p className={ styles.liveSnippetTitle }>{ messages.gettingStarted.addDataToIPFS }</p>
            <div className={ styles.liveSnippet }>
              <div className={ styles.liveSnippetEditorContainer }>
                <LiveEditor name="add" code={ codeAdd } onChange={ code => this.setState({ codeAdd: code }) } language='js' />
                <button className={ styles.liveSnippetRun } onClick={ this.handleRunClick('add') }>Run</button>
              </div>
              <div className={ styles.liveSnippetPreview } >
                <p className={ styles.liveSnippetOutput }>{ messages.gettingStarted.output }</p>
                <pre>
                  <code>{ outputAdd }</code>
                </pre>
              </div>
            </div>
            <p className={ styles.liveSnippetTitle }>{ messages.gettingStarted.getDataFromIPFS }</p>
            <p className={ styles.liveSnippetSubtitle }>{ messages.gettingStarted.usingJavascript }</p>
            <div className={ styles.liveSnippet }>
              <div className={ styles.liveSnippetEditorContainer }>
                <LiveEditor name="get" code={ codeGet } onChange={ code => this.setState({ codeGet: code }) } language='js' />
                <button className={ styles.liveSnippetRun } onClick={ this.handleRunClick('get') }>Run</button>
              </div>
              <div className={ styles.liveSnippetPreview } >
                <p className={ styles.liveSnippetOutput }>{ messages.gettingStarted.output }</p>
                <pre>
                  <code>{ outputGet }</code>
                </pre>
              </div>
            </div>

            { /*
            <p className={ styles.liveSnippetSubtitle }>{ messages.gettingStarted.usingCli }</p>
            <div className={ styles.liveSnippetCliContainer }>
              <SyntaxHighlighter codeStr={ `npm install helia -g
jsipfs cat ${cid}` } language='bash' />
            </div>

            <p className={ styles.liveSnippetSubtitle }>{ messages.gettingStarted.usingGateway }</p>
            <Link className={ styles.liveSnippetLink } href={ `https://ipfs.io/ipfs/${cid}` }>{ `https://ipfs.io/ipfs/${cid}` }</Link>

            */ }
          </div>
          <Button translationId="buttonLearnMore" href="https://github.com/ipfs-examples/helia-examples" />
        </div>
      </div>
    )
  }

  handleChange = (editor) => (content) => {
    if (content instanceof Error) {
      content = content.message
    }

    if (typeof content !== 'string') {
      content = `${content}`
    }

    if (editor === 'add') {
      // TODO: validate CID string
      if (typeof content === 'string' && content !== this.state.cid) {
        this.setState({ codeGet: codeGet(content), outputGet: '', cid: content })
      }
      this.setState({ outputAdd: this.state.outputAdd ? `${this.state.outputAdd}\n${content}` : content })
    } else {
      this.setState({ outputGet: this.state.outputGet ? `${this.state.outputGet}\n${content}` : content })
    }
  }

  // The "get" example can only run against a real CID from the "add" example.
  // Both ways of getting that wrong surface as the same opaque multibase
  // decoding error, so check the CID first and say what to do about it instead.
  // Returns null when there is nothing to report, including when the snippet has
  // been edited far enough that we can no longer find the CID in it.
  getCidProblem = (code) => {
    const { intl: { messages } } = this.props
    const match = code.match(GET_CODE_CID_PATTERN)

    if (match == null) {
      return null
    }

    const cid = match[1]

    if (cid === GET_CODE_CID_PLACEHOLDER) {
      return messages.gettingStarted.runAddExampleFirst.replace('{placeholder}', GET_CODE_CID_PLACEHOLDER)
    }

    if (!isValidCid(cid)) {
      return messages.gettingStarted.invalidCid.replace('{cid}', cid)
    }

    return null
  }

  handleRunClick = (editor) => async () => {
    const code = editor === 'add' ? this.state.codeAdd : this.state.codeGet
    const outputKey = editor === 'add' ? 'outputAdd' : 'outputGet'

    if (editor === 'get') {
      const problem = this.getCidProblem(code)

      if (problem != null) {
        this.setState({ [outputKey]: problem })
        return
      }
    }

    const handleLog = this.handleChange(editor)
    // variables available to the demo code
    const scope = {
      createHelia: () => this.helia,
      console: log(handleLog),
      CID,
      strings
    }

    try {
      // can't use imports in dynamic code so strip them
      const codeWithoutImports = code.replace(/import.*/g, '').trim()

      this.setState({ [outputKey]: '' })
      await runCode(codeWithoutImports, scope)
    } catch (err) {
      console.error(err)
      this.setState({ [outputKey]: err.message })
    }
  }
}

GettingStarted.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(GettingStarted)
