import { runSeed as runAdmin } from './admin.seed';
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
  await runAdmin();
};

if (process.argv[1]?.includes('seed.all')) {
  runAll()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default runAll;
