import { runSeed as runProfile } from './profile.seed';
import { runSeed as runSettings } from './settings.seed';
import { runSeed as runSkills } from './skills.seed';
import { runSeed as runExperience } from './experience.seed';
import { runSeed as runProjects } from './projects.seed';
import { runSeed as runBlogs } from './blogs.seed';
import { runSeed as runMedia } from './media.seed';

const runAll = async () => {
  await runProfile();
  await runSettings();
  await runSkills();
  await runExperience();
  await runProjects();
  await runBlogs();
  await runMedia();
};

if (process.argv[1]?.includes('seed.all')) {
  runAll();
}

export default runAll;
