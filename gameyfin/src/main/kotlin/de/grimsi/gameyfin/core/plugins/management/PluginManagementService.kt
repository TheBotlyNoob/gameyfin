package de.grimsi.gameyfin.core.plugins.management

import org.springframework.stereotype.Service

@Service
class PluginManagementService(
    private val pluginManager: GameyfinPluginManager
) {
    fun getPlugins(): List<PluginDto> {
        return pluginManager.plugins.map {
            PluginDto(
                it.pluginId,
                it.descriptor.pluginDescription,
                it.descriptor.version,
                it.descriptor.provider,
                it.pluginState
            )
        }
    }

    fun getPlugin(pluginId: String): PluginDto {
        val plugin = pluginManager.getPlugin(pluginId)
        return PluginDto(
            plugin.pluginId,
            plugin.descriptor.pluginDescription,
            plugin.descriptor.version,
            plugin.descriptor.provider,
            plugin.pluginState
        )
    }

    fun startPlugin(pluginId: String) {
        pluginManager.startPlugin(pluginId)
    }

    fun stopPlugin(pluginId: String) {
        pluginManager.stopPlugin(pluginId)
    }

    fun restartPlugin(pluginId: String) {
        pluginManager.restart(pluginId)
    }

    fun enablePlugin(pluginId: String) {
        pluginManager.enablePlugin(pluginId)
    }

    fun disablePlugin(pluginId: String) {
        pluginManager.disablePlugin(pluginId)
    }

    fun validatePluginConfig(pluginId: String): Boolean {
        return pluginManager.validatePluginConfig(pluginId)
    }
}