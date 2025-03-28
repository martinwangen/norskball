<?php
/**
 * Template Name: Match Ratings
 * Description: A template for displaying match ratings in a modern, responsive layout
 */

get_header();

// Configure API URL - Update this to match your backend server URL
$api_url = 'http://192.168.10.124:5000/api/matches/ratings';

// Add CORS headers to the response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Fetch match ratings data from the API
$args = array(
    'timeout' => 30,
    'sslverify' => false,
    'headers' => array(
        'Accept' => 'application/json',
        'Content-Type' => 'application/json'
    )
);

$response = wp_remote_get($api_url, $args);
$matches = [];

// Debug information
echo '<script>
console.log("API Response:", ' . json_encode([
    'url' => $api_url,
    'response_code' => wp_remote_retrieve_response_code($response),
    'response_message' => wp_remote_retrieve_response_message($response),
    'is_error' => is_wp_error($response),
    'error_message' => is_wp_error($response) ? $response->get_error_message() : null
]) . ');
</script>';

if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    // Log the raw response body
    echo '<script>console.log("Raw Response Body:", ' . json_encode($body) . ');</script>';
    
    // Log the parsed data
    echo '<script>console.log("Parsed Data:", ' . json_encode($data) . ');</script>';
    
    if ($data && isset($data['matches'])) {
        $matches = $data['matches'];
        // Log the matches array
        echo '<script>console.log("Matches Array:", ' . json_encode($matches) . ');</script>';
    } else {
        echo '<script>console.log("No matches found in response");</script>';
    }
} else {
    echo '<script>console.log("API Error:", ' . json_encode($response->get_error_message()) . ');</script>';
    // Add a visible error message on the page
    echo '<div class="error-message">Unable to connect to the match ratings service. Please try again later.</div>';
}
?>

<div class="elementor-container">
    <div class="elementor-row">
        <div class="elementor-column elementor-col-100">
            <div class="elementor-widget-container">
                <div class="match-ratings-container">
                    <?php if (empty($matches)) : ?>
                        <div class="text-center">
                            <div class="text-h6">No match ratings available</div>
                        </div>
                    <?php else : ?>
                        <!-- Match List -->
                        <div class="match-list-container">
                            <div class="horizontal-list">
                                <?php foreach ($matches as $match) : ?>
                                    <div class="match-item" data-match-id="<?php echo esc_attr($match['id']); ?>">
                                        <div class="team-names">
                                            <div class="team home">
                                                <?php if (!empty($match['homeTeam']['logo'])) : ?>
                                                    <img src="<?php echo esc_url($match['homeTeam']['logo']); ?>" 
                                                         alt="<?php echo esc_attr($match['homeTeam']['name']); ?>" 
                                                         class="team-logo">
                                                <?php endif; ?>
                                                <div class="team-name"><?php echo esc_html($match['homeTeam']['name'] ?? 'Home Team'); ?></div>
                                            </div>
                                            <div class="vs">vs</div>
                                            <div class="team away">
                                                <?php if (!empty($match['awayTeam']['logo'])) : ?>
                                                    <img src="<?php echo esc_url($match['awayTeam']['logo']); ?>" 
                                                         alt="<?php echo esc_attr($match['awayTeam']['name']); ?>" 
                                                         class="team-logo">
                                                <?php endif; ?>
                                                <div class="team-name"><?php echo esc_html($match['awayTeam']['name'] ?? 'Away Team'); ?></div>
                                            </div>
                                        </div>
                                        <div class="match-date">
                                            <?php echo esc_html(date('F j, Y', strtotime($match['scheduledDate']))); ?>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <!-- Match Details -->
                        <div class="match-display-container">
                            <?php foreach ($matches as $match) : ?>
                                <div class="match-details" data-match-id="<?php echo esc_attr($match['id']); ?>" style="display: none;">
                                    <!-- Home Team -->
                                    <?php if (!empty($match['homeTeamLineup']['players'])) : ?>
                                        <div class="team-section">
                                            <div class="team-header">
                                                <?php if (!empty($match['homeTeam']['logo'])) : ?>
                                                    <img src="<?php echo esc_url($match['homeTeam']['logo']); ?>" 
                                                         alt="<?php echo esc_attr($match['homeTeam']['name']); ?>" 
                                                         class="team-logo">
                                                <?php endif; ?>
                                                <div class="text-h6"><?php echo esc_html($match['homeTeam']['name'] ?? 'Home Team'); ?></div>
                                            </div>
                                            <table class="player-table">
                                                <thead>
                                                    <tr>
                                                        <th>Pos</th>
                                                        <th>Player</th>
                                                        <th>Rating</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php 
                                                    $players = $match['homeTeamLineup']['players'];
                                                    usort($players, function($a, $b) {
                                                        return intval($a['position']) - intval($b['position']);
                                                    });
                                                    foreach ($players as $player) : 
                                                    ?>
                                                        <tr>
                                                            <td class="text-center"><?php echo esc_html($player['position']); ?></td>
                                                            <td><?php echo esc_html($player['firstName'] . ' ' . $player['lastName']); ?></td>
                                                            <td class="text-center"><?php echo $player['rating'] ? esc_html($player['rating']) : '-'; ?></td>
                                                        </tr>
                                                    <?php endforeach; ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    <?php endif; ?>

                                    <!-- Away Team -->
                                    <?php if (!empty($match['awayTeamLineup']['players'])) : ?>
                                        <div class="team-section">
                                            <div class="team-header">
                                                <?php if (!empty($match['awayTeam']['logo'])) : ?>
                                                    <img src="<?php echo esc_url($match['awayTeam']['logo']); ?>" 
                                                         alt="<?php echo esc_attr($match['awayTeam']['name']); ?>" 
                                                         class="team-logo">
                                                <?php endif; ?>
                                                <div class="text-h6"><?php echo esc_html($match['awayTeam']['name'] ?? 'Away Team'); ?></div>
                                            </div>
                                            <table class="player-table">
                                                <thead>
                                                    <tr>
                                                        <th>Pos</th>
                                                        <th>Player</th>
                                                        <th>Rating</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php 
                                                    $players = $match['awayTeamLineup']['players'];
                                                    usort($players, function($a, $b) {
                                                        return intval($a['position']) - intval($b['position']);
                                                    });
                                                    foreach ($players as $player) : 
                                                    ?>
                                                        <tr>
                                                            <td class="text-center"><?php echo esc_html($player['position']); ?></td>
                                                            <td><?php echo esc_html($player['firstName'] . ' ' . $player['lastName']); ?></td>
                                                            <td class="text-center"><?php echo $player['rating'] ? esc_html($player['rating']) : '-'; ?></td>
                                                        </tr>
                                                    <?php endforeach; ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.match-ratings-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
}

.match-list-container {
    width: 100%;
    overflow-x: auto;
    background: linear-gradient(145deg, var(--e-global-color-surface, #ffffff), var(--e-global-color-surface-variant, #f5f5f5));
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border: 1px solid var(--e-global-color-border, #e0e0e0);
}

.horizontal-list {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    gap: 1rem;
    min-width: min-content;
    padding: 0.5rem;
}

.match-item {
    flex: 0 0 320px;
    height: 90px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    padding: 1rem;
    border: 1px solid var(--e-global-color-border, #e0e0e0);
    background: linear-gradient(145deg, var(--e-global-color-surface, #ffffff), var(--e-global-color-surface-variant, #f5f5f5));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
}

.match-item:hover {
    background: var(--e-global-color-surface-variant, #f5f5f5);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.match-item.active {
    background: linear-gradient(145deg, var(--e-global-color-primary, #1976d2), var(--e-global-color-secondary, #2196f3));
    border-color: var(--e-global-color-primary, #1976d2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}

.team-names {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.team-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--e-global-color-surface, #ffffff);
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 2px solid var(--e-global-color-border, #e0e0e0);
    transition: all 0.3s ease;
}

.team-name {
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--e-global-color-on-surface, #000000);
}

.vs {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--e-global-color-on-surface, #000000);
    padding: 0.3rem 0.6rem;
    background: var(--e-global-color-surface, #ffffff);
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--e-global-color-border, #e0e0e0);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.match-date {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--e-global-color-on-surface, #000000);
    opacity: 0.8;
    margin-top: 0.25rem;
}

.match-display-container {
    width: 100%;
    overflow-y: auto;
}

.match-details {
    display: none;
}

.match-details.active {
    display: block;
}

.team-section {
    background: var(--e-global-color-surface, #ffffff);
    padding: 1.75rem;
    border-radius: 16px;
    border: 1px solid var(--e-global-color-border, #e0e0e0);
    margin-bottom: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.team-section:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

.team-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
    background: var(--e-global-color-surface-variant, #f5f5f5);
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 1px solid var(--e-global-color-border, #e0e0e0);
}

.player-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--e-global-color-surface-variant, #f5f5f5);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--e-global-color-border, #e0e0e0);
}

.player-table th {
    padding: 1.25rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    background: var(--e-global-color-surface, #ffffff);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 2px solid var(--e-global-color-border, #e0e0e0);
    text-align: left;
}

.player-table td {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
    border-bottom: 1px solid var(--e-global-color-border, #e0e0e0);
}

.player-table tr:hover {
    background: var(--e-global-color-surface, #ffffff);
    transform: translateX(6px);
    transition: all 0.2s ease;
}

.text-center {
    text-align: center;
}

@media (max-width: 768px) {
    .match-item {
        flex: 0 0 280px;
        height: 80px;
        padding: 0.75rem;
    }

    .team-logo {
        width: 36px;
        height: 36px;
        padding: 3px;
    }

    .team-name {
        font-size: 0.85rem;
    }

    .vs {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }

    .match-date {
        font-size: 0.75rem;
    }

    .team-section {
        padding: 1.25rem;
    }

    .player-table td,
    .player-table th {
        padding: 1rem 1.25rem;
        font-size: 0.95rem;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const matchItems = document.querySelectorAll('.match-item');
    const matchDetails = document.querySelectorAll('.match-details');

    // Show first match by default
    if (matchItems.length > 0) {
        matchItems[0].classList.add('active');
        matchDetails[0].classList.add('active');
    }

    matchItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            matchItems.forEach(i => i.classList.remove('active'));
            matchDetails.forEach(d => d.classList.remove('active'));

            // Add active class to clicked item and corresponding details
            item.classList.add('active');
            matchDetails[index].classList.add('active');
        });
    });
});
</script>

<?php get_footer(); ?> 