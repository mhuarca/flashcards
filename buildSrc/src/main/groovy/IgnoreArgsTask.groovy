import org.gradle.api.tasks.options.Option;
import org.gradle.api.DefaultTask;

class IgnoreArgsTask extends DefaultTask {

    @Option(option = 'args', description = "'args' param will be ignored.")
    public void setArgs(String args) {
        // Do nothing
    }
}