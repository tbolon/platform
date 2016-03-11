// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import ChannelView from '../components/channel_view.jsx';
import ChannelLoader from '../components/channel_loader.jsx';
import ErrorBar from '../components/error_bar.jsx';
import * as Client from '../utils/client.jsx';

import GetPostLinkModal from '../components/get_post_link_modal.jsx';
import GetTeamInviteLinkModal from '../components/get_team_invite_link_modal.jsx';
import EditPostModal from '../components/edit_post_modal.jsx';
import DeletePostModal from '../components/delete_post_modal.jsx';
import MoreChannelsModal from '../components/more_channels.jsx';
import TeamSettingsModal from '../components/team_settings_modal.jsx';
import RemovedFromChannelModal from '../components/removed_from_channel_modal.jsx';
import RegisterAppModal from '../components/register_app_modal.jsx';
import ImportThemeModal from '../components/user_settings/import_theme_modal.jsx';
import InviteMemberModal from '../components/invite_member_modal.jsx';

import * as EventHelpers from '../dispatcher/event_helpers.jsx';

var IntlProvider = ReactIntl.IntlProvider;

class Root extends React.Component {
    constructor() {
        super();
        this.state = {
            translations: null,
            loaded: false
        };
    }

    static propTypes() {
        return {
            map: React.PropTypes.object.isRequired
        };
    }

    componentWillMount() {
        Client.getTranslations(
            this.props.map.Locale,
            (data) => {
                this.setState({
                    translations: data,
                    loaded: true
                });
            },
            () => {
                this.setState({
                    loaded: true
                });
            }
        );
    }

    render() {
        if (!this.state.loaded) {
            return <div></div>;
        }

        return (
            <IntlProvider
                locale={this.props.map.Locale}
                messages={this.state.translations}
            >
                <div className='channel-view'>
                    <ChannelLoader/>
                    <ErrorBar/>
                    <ChannelView/>
                    <GetPostLinkModal/>
                    <GetTeamInviteLinkModal/>
                    <InviteMemberModal/>
                    <ImportThemeModal/>
                    <TeamSettingsModal/>
                    <MoreChannelsModal/>
                    <EditPostModal/>
                    <DeletePostModal/>
                    <RemovedFromChannelModal/>
                    <RegisterAppModal/>
                </div>
            </IntlProvider>
        );
    }
}

global.window.setup_channel_page = function setup(props, team, channel) {
    if (props.PostId === '') {
        EventHelpers.emitChannelClickEvent(channel);
    } else {
        EventHelpers.emitPostFocusEvent(props.PostId);
    }

    ReactDOM.render(
        <Root map={props}/>,
        document.getElementById('channel_view')
    );
};
