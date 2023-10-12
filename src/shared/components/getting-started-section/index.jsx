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

class GettingStarted extends Component {
  state = {
    codeAdd: codeAdd(ADD_CODE_DATA).trim(),
    codeGet: codeGet('<YOUR CID HERE>').trim(),
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

    const node = await this.IPFS.create()
    // Add the data to IPFS so that it can be fetched instantly
    for await (const { cid } of node.add(ADD_CODE_DATA)) {
      this.setState({ cid: cid.toString(), codeGet: codeGet(cid) })
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

  handleRunClick = (editor) => async () => {
    const handleLog = this.handleChange(editor)
    // variables available to the demo code
    const scope = {
      createHelia: () => this.helia,
      console: log(handleLog),
      CID,
      strings
    }
    const code = editor === 'add' ? this.state.codeAdd : this.state.codeGet
    const outputKey = editor === 'add' ? 'outputAdd' : 'outputGet'

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
