package de.grimsi.gameyfin.core.plugins

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import java.nio.file.Path

@Configuration
class PluginManagerConfig(
    private val pluginConfigRepository: PluginConfigRepository
) {
    private val log = KotlinLogging.logger {}
    private val pluginPath = System.getProperty("pf4j.pluginsDir", "plugins")

    @Bean
    fun pluginManager() = SpringDevtoolsPluginManager(Path.of(pluginPath), pluginConfigRepository)

    @EventListener(ApplicationReadyEvent::class)
    fun loadPlugins() {
        pluginManager().loadPlugins()
        pluginManager().startPlugins()
        log.info { "Loaded plugins: ${pluginManager().plugins.map { it.pluginId }}" }
    }
}