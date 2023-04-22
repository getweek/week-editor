import { IUi } from '../../../core/src/types';
import { Menu } from './Menu';
import { Options } from './types';
export class FloatingUiPlugin implements IUi {
  options: Options;
  
  constructor(options: Options) {
    this.options = options;
  }

  ui({ readOnly }) {
    return readOnly ? null : <Menu options={this.options} />;
  }
}
