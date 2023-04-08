import { WeekEditor } from './WeekEditor';
// import { DnDPlugin } from '@week/dnd-plugin';

export default {
  title: 'WeekEditor',
  component: WeekEditor,
};
export const Primary = {
  render: () => {
    const plugins = [];

    return <WeekEditor plugins={plugins} value={[]} onChange={() => {}} />;
  },
};
