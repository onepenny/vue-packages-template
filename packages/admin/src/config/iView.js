import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Icon,
  Input,
  InputNumber,
  Select,
  Option,
  Table,
  Checkbox,
  CheckboxGroup,
  Page,
  Layout,
  Menu,
  Message,
  MenuItem,
  Sider,
  Submenu,
  Cascader,
  Col,
  Row,
  Spin,
  Radio,
  RadioGroup,
  Tree,
  Modal,
  Tag,
  Tooltip,
  Progress,
  ColorPicker,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Affix
} from 'iview';

// 当引入其他组件发现冲突时，可以加入 i- 前缀
export default Vue => {
  Vue.component('Button', Button);
  Vue.component('BreadcrumbItem', BreadcrumbItem);
  Vue.component('Form', Form);
  Vue.component('FormItem', FormItem);
  Vue.component('Icon', Icon);
  Vue.component('Input', Input);
  Vue.component('i-input', Input); // cascaderMulti
  Vue.component('InputNumber', InputNumber);
  Vue.component('Select', Select);
  Vue.component('Option', Option);
  Vue.component('Table', Table);
  Vue.component('Checkbox', Checkbox);
  Vue.component('CheckboxGroup', CheckboxGroup);
  Vue.component('Page', Page);
  Vue.component('Layout', Layout);
  Vue.component('Menu', Menu);
  Vue.component('MenuItem', MenuItem);
  Vue.component('Breadcrumb', Breadcrumb);
  Vue.component('Sider', Sider);
  Vue.component('Submenu', Submenu);
  Vue.component('Cascader', Cascader);
  Vue.component('Col', Col);
  Vue.component('Row', Row);
  Vue.component('Spin', Spin);
  Vue.component('Radio', Radio);
  Vue.component('RadioGroup', RadioGroup);
  Vue.component('Tree', Tree);
  Vue.component('Modal', Modal);
  Vue.component('Tag', Tag);
  Vue.component('Tooltip', Tooltip);
  Vue.component('Progress', Progress);
  Vue.component('ColorPicker', ColorPicker);
  Vue.component('Dropdown', Dropdown);
  Vue.component('DropdownMenu', DropdownMenu);
  Vue.component('DropdownItem', DropdownItem);
  Vue.component('Affix', Affix);
  Vue.prototype.$Message = Message;
  Vue.prototype.$Modal = Modal;
};
