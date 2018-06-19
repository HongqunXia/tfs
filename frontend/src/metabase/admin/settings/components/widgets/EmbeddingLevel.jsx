import React, { Component } from 'react'
import ReactRetinaImage from 'react-retina-image'
import { t } from 'c-3po';
import SettingsInput from "./SettingInput"

const PREMIUM_EMBEDDING_STORE_URL = ''
const PREMIUM_EMBEDDING_SETTING_KEY = ''

const PremiumTokenInput = ({ token, onChangeSetting }) =>
    <div className="mb3">
        
    </div>

const PremiumExplanation = ({ showEnterScreen }) =>
    <div>
       
    </div>

class PremiumEmbedding extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEnterScreen: props.token
        }
    }
    render () {
        const { token, onChangeSetting } = this.props
        const { showEnterScreen } = this.state

        return (
            <div className="text-centered text-paragraph">
                { showEnterScreen
                    ? (
                        <PremiumTokenInput
                            onChangeSetting={onChangeSetting}
                            token={token}
                        />
                    )
                    : (
                        <PremiumExplanation
                            showEnterScreen={() =>
                                this.setState({ showEnterScreen: true })
                            }
                        />
                    )
                }
            </div>
        )
    }
}

class EmbeddingLevel extends Component {
    render () {
        const { onChangeSetting, settingValues } = this.props

        const premiumToken = settingValues[PREMIUM_EMBEDDING_SETTING_KEY]

        return (
            <div className="bordered rounded full text-centered" style={{ maxWidth: 820 }}>
            </div>
        )
    }
}

export default EmbeddingLevel
