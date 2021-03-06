import Vue from 'vue'
import {
  Button,
  Loading,
  Input,
  Message,
  MessageBox,
  Notification,
  Dialog
} from 'element-ui'
import { ElLoadingComponent, LoadingServiceOptions } from 'element-ui/types/loading'
import { ElMessageBox, ElMessageBoxShortcutMethod } from 'element-ui/types/message-box'
import { ElNotification } from 'element-ui/types/notification'
import { ElMessage } from 'element-ui/types/message'

Vue.use(Button)
Vue.use(Loading)
Vue.use(Input)
Vue.use(Dialog)

declare module 'vue/types/vue' {
  interface Vue {
    $loading: (options: LoadingServiceOptions) => ElLoadingComponent;
    $msgbox: ElMessageBox;
    $alert: ElMessageBoxShortcutMethod;
    $confirm: ElMessageBoxShortcutMethod;
    $prompt: ElMessageBoxShortcutMethod;
    $notify: ElNotification;
    $message: ElMessage;
  }
}

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
